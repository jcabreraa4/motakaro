use std::ffi::OsStr;

use tauri::{Context, Runtime};

// Flags that must be answered without booting Tauri: once `run` is called the
// splash screen and the remote webview are created, which takes seconds.
const VERSION_FLAGS: &[&str] = &["-V", "--version"];
const HELP_FLAGS: &[&str] = &["-h", "--help"];

/// Answers the argument-only invocations (`-V/--version`, `-h/--help`).
///
/// Returns `true` when the invocation was fully handled here, so the caller can
/// exit before `tauri::Builder::run`. Any other argument is left untouched and
/// the app starts normally.
pub fn handle<R: Runtime>(context: &Context<R>) -> bool {
  let args: Vec<_> = std::env::args_os().skip(1).collect();
  let has = |flags: &[&str]| {
    args
      .iter()
      .any(|arg| flags.iter().any(|flag| arg.as_os_str() == OsStr::new(flag)))
  };

  let info = context.package_info();

  if has(VERSION_FLAGS) {
    println!("{} {}", command_name(context), info.version);
    return true;
  }

  if has(HELP_FLAGS) {
    println!(
      "{command} {version}

Usage:
  {command}
  {command} --version
  {command} --help

Options:
  -h, --help     Print help
  -V, --version  Print version",
      command = command_name(context),
      version = info.version,
    );
    return true;
  }

  false
}

/// Name the user typed to launch the app (`motakaro`, `motakaro-admins`), which
/// is the binary name, falling back to the product name.
fn command_name<R: Runtime>(context: &Context<R>) -> String {
  std::env::current_exe()
    .ok()
    .and_then(|path| path.file_stem().map(|stem| stem.to_string_lossy().into_owned()))
    .unwrap_or_else(|| context.package_info().name.clone())
}
