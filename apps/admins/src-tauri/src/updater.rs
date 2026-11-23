use std::{
  fs,
  io::IsTerminal,
  path::{Path, PathBuf},
  process::Command,
  time::{SystemTime, UNIX_EPOCH},
};

use semver::Version;

// Rolling release: its assets are replaced on every publish, so the `desktop`
// tag never describes a version. The version lives in `latest.json`, generated
// by the desktop workflow from `tauri.conf.json` and the packaged `.deb`.
const RELEASE_BASE: &str = "https://github.com/jcabreraa4/motakaro/releases/download/desktop";

// Per-app identity: must match `tauri.conf.json` (`productName`,
// `mainBinaryName`), the Debian package name and the key in `latest.json`.
const DISPLAY_NAME: &str = "Motakaro Admins";
const PACKAGE: &str = "motakaro-admins";
const DEB_FILE: &str = "motakaro-admins_amd64.deb";
const MANIFEST_KEY: &str = "admins";

struct Release {
  version: Version,
  file: String,
  sha256: String,
}

/// Checks the published manifest and, when a newer version exists, downloads,
/// verifies and installs its Debian package. Returns the process exit code.
pub fn update() -> i32 {
  match run() {
    Ok(()) => 0,
    Err(error) => {
      eprintln!("error: {error}");
      1
    }
  }
}

fn run() -> Result<(), String> {
  if !cfg!(target_os = "linux") {
    return Err(format!(
      "`update` only manages Debian packages on Linux.\nDownload the installer for this platform from {RELEASE_BASE}"
    ));
  }

  println!("Checking for updates...\n");

  let installed = installed_version()?;
  let release = fetch_release()?;

  println!("Installed version: {installed}");
  println!("Available version: {}\n", release.version);

  if release.version <= installed {
    println!("{DISPLAY_NAME} is already up to date.");
    return Ok(());
  }

  println!("Update available!\n");

  let temporary = TempDir::new()?;
  let deb = temporary.path().join(DEB_FILE);

  println!("Downloading {DISPLAY_NAME} {}...", release.version);
  download(&asset_url(&release.file), &deb)?;

  println!("Verifying package integrity...");
  verify_sha256(&deb, &release.sha256)?;
  verify_package(&deb, &release.version)?;

  println!("Installing update...\n");
  install(&deb)?;

  println!(
    "\nSuccessfully updated {DISPLAY_NAME} to {}.",
    release.version
  );
  println!("Restart {DISPLAY_NAME} to use the new version.");

  Ok(())
}

/// Version Debian reports for the installed package, which is the one `apt`
/// would replace (the running binary may be older than the packaged one).
fn installed_version() -> Result<Version, String> {
  let output = Command::new("dpkg-query")
    .args(["-W", "-f=${Version}", PACKAGE])
    .output()
    .map_err(|error| format!("could not run dpkg-query: {error}"))?;

  if !output.status.success() {
    return Err(format!(
      "{DISPLAY_NAME} was not installed from a Debian package, so `update` cannot manage it.\nInstall the .deb with `sudo apt install <file>.deb` and try again."
    ));
  }

  let raw = String::from_utf8_lossy(&output.stdout);
  let raw = raw.trim();

  Version::parse(raw).map_err(|_| format!("unexpected installed version `{raw}`"))
}

fn fetch_release() -> Result<Release, String> {
  let body = curl(&format!(
    "{RELEASE_BASE}/latest.json?t={}",
    unix_now()
  ))
  .map_err(|error| {
    format!("could not reach the update server: {error}\nThe installed version was left untouched.")
  })?;

  parse_release(&body)
}

fn parse_release(body: &str) -> Result<Release, String> {
  let manifest: serde_json::Value = serde_json::from_str(body)
    .map_err(|error| format!("the update manifest is not valid JSON: {error}"))?;

  let entry = manifest
    .get(MANIFEST_KEY)
    .ok_or_else(|| format!("the update manifest has no `{MANIFEST_KEY}` entry"))?;

  let field = |name: &str| {
    entry
      .get(name)
      .and_then(|value| value.as_str())
      .ok_or_else(|| format!("the update manifest has no `{MANIFEST_KEY}.{name}`"))
  };

  let file = field("file")?;

  if file != DEB_FILE {
    return Err(format!(
      "the update manifest points to `{file}`, expected `{DEB_FILE}`"
    ));
  }

  let raw_version = field("version")?;
  let version = Version::parse(raw_version)
    .map_err(|_| format!("the update manifest has an invalid version `{raw_version}`"))?;

  Ok(Release {
    version,
    file: file.to_owned(),
    sha256: field("sha256")?.to_lowercase(),
  })
}

/// `?t=` busts the CDN cache, which otherwise keeps serving the previous upload
/// for a while after the release assets are replaced.
fn asset_url(file: &str) -> String {
  format!("{RELEASE_BASE}/{file}?t={}", unix_now())
}

fn curl(url: &str) -> Result<String, String> {
  let output = curl_command()
    .args(["--max-time", "30"])
    .arg(url)
    .output()
    .map_err(|error| format!("could not run curl: {error}"))?;

  if !output.status.success() {
    return Err(String::from_utf8_lossy(&output.stderr).trim().to_owned());
  }

  Ok(String::from_utf8_lossy(&output.stdout).into_owned())
}

fn curl_command() -> Command {
  let mut command = Command::new("curl");
  command.args([
    "--fail",
    "--silent",
    "--show-error",
    "--location",
    "--proto",
    "=https",
    "--tlsv1.2",
    "--connect-timeout",
    "10",
  ]);
  command
}

fn download(url: &str, destination: &Path) -> Result<(), String> {
  let mut command = curl_command();

  if std::io::stdout().is_terminal() {
    command.arg("--progress-bar");
  }

  let status = command
    .args(["--max-time", "600", "--output"])
    .arg(destination)
    .arg(url)
    .status()
    .map_err(|error| format!("could not run curl: {error}"))?;

  if !status.success() {
    return Err("the download failed; the installed version was left untouched".to_owned());
  }

  Ok(())
}

fn verify_sha256(file: &Path, expected: &str) -> Result<(), String> {
  let output = Command::new("sha256sum")
    .arg(file)
    .output()
    .map_err(|error| format!("could not run sha256sum: {error}"))?;

  if !output.status.success() {
    return Err("could not compute the SHA-256 of the downloaded package".to_owned());
  }

  let stdout = String::from_utf8_lossy(&output.stdout);
  let actual = stdout.split_whitespace().next().unwrap_or_default();

  if !actual.eq_ignore_ascii_case(expected) {
    return Err(format!(
      "the downloaded package does not match the published checksum (expected {expected}, got {actual}).\nThe update was cancelled and nothing was installed."
    ));
  }

  Ok(())
}

/// The package must be ours and the announced version, so a wrong asset can
/// never be installed as root.
fn verify_package(file: &Path, expected: &Version) -> Result<(), String> {
  let output = Command::new("dpkg-deb")
    .arg("-f")
    .arg(file)
    .args(["Package", "Version"])
    .output()
    .map_err(|error| format!("could not run dpkg-deb: {error}"))?;

  if !output.status.success() {
    return Err("the downloaded file is not a valid Debian package".to_owned());
  }

  let fields = String::from_utf8_lossy(&output.stdout).into_owned();
  let field = |name: &str| {
    fields
      .lines()
      .find_map(|line| line.strip_prefix(name)?.strip_prefix(':'))
      .map(str::trim)
      .unwrap_or_default()
  };

  let package = field("Package");
  if package != PACKAGE {
    return Err(format!(
      "the downloaded package is `{package}`, expected `{PACKAGE}`"
    ));
  }

  let version = field("Version");
  if version != expected.to_string() {
    return Err(format!(
      "the downloaded package is version `{version}`, expected `{expected}`"
    ));
  }

  Ok(())
}

fn install(file: &Path) -> Result<(), String> {
  let running_as_root = is_root();
  let mut command = if running_as_root {
    Command::new("apt-get")
  } else {
    // `sudo` resets the environment, so the non-interactive frontend has to be
    // passed through explicitly. The password prompt stays in the user's
    // terminal: privileges are never escalated silently.
    let mut command = Command::new("sudo");
    command.args(["env", "DEBIAN_FRONTEND=noninteractive", "apt-get"]);
    command
  };

  // `apt-get` instead of `apt`, which has no stable CLI for scripts. It also
  // refuses to downgrade, as a second line of defence after the semver check.
  let status = command
    .args(["install", "--yes"])
    .arg(file)
    .env("DEBIAN_FRONTEND", "noninteractive")
    .status()
    .map_err(|error| match (error.kind(), running_as_root) {
      (std::io::ErrorKind::NotFound, true) => "could not find `apt-get` on this system".to_owned(),
      (std::io::ErrorKind::NotFound, false) => format!(
        "could not find `sudo` and the update needs root.\nInstall it manually with:\n  sudo apt-get install --yes {}",
        file.display()
      ),
      _ => format!("could not run the package manager: {error}"),
    })?;

  if !status.success() {
    return Err(
      "the package manager could not install the update; the previous version is still in place.\nRun the update command again to retry."
        .to_owned(),
    );
  }

  Ok(())
}

fn is_root() -> bool {
  Command::new("id")
    .arg("-u")
    .output()
    .is_ok_and(|output| String::from_utf8_lossy(&output.stdout).trim() == "0")
}

/// Removes the downloaded package whatever the outcome.
struct TempDir(PathBuf);

impl TempDir {
  fn new() -> Result<Self, String> {
    let path = std::env::temp_dir().join(format!("motakaro-update-{}", std::process::id()));
    fs::create_dir_all(&path)
      .map_err(|error| format!("could not create a temporary directory: {error}"))?;
    Ok(Self(path))
  }

  fn path(&self) -> &Path {
    &self.0
  }
}

impl Drop for TempDir {
  fn drop(&mut self) {
    let _ = fs::remove_dir_all(&self.0);
  }
}

fn unix_now() -> u64 {
  SystemTime::now()
    .duration_since(UNIX_EPOCH)
    .map(|elapsed| elapsed.as_secs())
    .unwrap_or_default()
}
