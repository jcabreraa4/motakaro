use std::ffi::OsStr;

use tauri::{Context, Runtime};

use crate::updater;

// Flags that must be answered without booting Tauri: once `run` is called the
// splash screen and the remote webview are created, which takes seconds.
const VERSION_FLAGS: &[&str] = &["-V", "--version"];
const HELP_FLAGS: &[&str] = &["-h", "--help"];
const UPDATE: &str = "update";

/// Answers the argument-only invocations (`-V/--version`, `-h/--help`,
/// `update`).
///
/// Returns the exit code when the invocation was fully handled here, so the
/// caller can stop before `tauri::Builder::run`. Any other argument is left
/// untouched and the app starts normally.
pub fn handle<R: Runtime>(context: &Context<R>) -> Option<i32> {
  let args: Vec<_> = std::env::args_os().skip(1).collect();
  let has = |flags: &[&str]| {
    args
      .iter()
      .any(|arg| flags.iter().any(|flag| arg.as_os_str() == OsStr::new(flag)))
  };

  let info = context.package_info();

  if has(VERSION_FLAGS) {
    println!("{} {}", command_name(context), info.version);
    return Some(0);
  }

  if has(HELP_FLAGS) {
    println!(
      "{command} {version}

Usage:
  {command}
  {command} update
  {command} --version
  {command} --help

Commands:
  update         Check for a new version and install it

Options:
  -h, --help     Print help
  -V, --version  Print version",
      command = command_name(context),
      version = info.version,
    );
    return Some(0);
  }

  if args
    .first()
    .is_some_and(|arg| arg.as_os_str() == OsStr::new(UPDATE))
  {
    return Some(updater::update());
  }

  None
}

/// Name the user typed to launch the app (`motakaro`, `motakaro-admins`), which
/// is the binary name, falling back to the product name.
fn command_name<R: Runtime>(context: &Context<R>) -> String {
  std::env::current_exe()
    .ok()
    .and_then(|path| path.file_stem().map(|stem| stem.to_string_lossy().into_owned()))
    .unwrap_or_else(|| context.package_info().name.clone())
}
