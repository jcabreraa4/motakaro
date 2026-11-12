use std::borrow::Cow;

use tauri::{
  http::{header, Request as HttpRequest, Response, StatusCode},
  AppHandle, Manager, WindowEvent,
};

// The splash screen is embedded at compile time so it is available instantly
// and works without any network connection, independently of the remote
// frontend configured in `build.frontendDist` (which disables Tauri's local
// asset protocol).
const SPLASH_HTML: &str = include_str!("../splash/index.html");
const SPLASH_LOGO: &[u8] = include_bytes!("../splash/logo.webp");

fn splash_response(
  status: StatusCode,
  content_type: &'static str,
  body: &'static [u8],
) -> Response<Cow<'static, [u8]>> {
  Response::builder()
    .status(status)
    .header(header::CONTENT_TYPE, content_type)
    .body(Cow::Borrowed(body))
    .expect("static splash response is always valid")
}

/// Shows the (hidden) main window and closes the splash screen.
///
/// Called by the splash screen once the remote frontend signaled that the app
/// is ready (`motakaro:app-ready`), or when the user chooses to continue.
#[tauri::command]
fn finish_startup(app: AppHandle) -> Result<(), String> {
  let main = app
    .get_webview_window("main")
    .ok_or("main window not found")?;
  // The main window is created hidden; re-assert the maximized state before
  // showing it so the layout is restored correctly.
  main.maximize().map_err(|e| e.to_string())?;
  main.show().map_err(|e| e.to_string())?;
  if let Some(splash) = app.get_webview_window("splashscreen") {
    splash.close().map_err(|e| e.to_string())?;
  }
  Ok(())
}

/// Reloads the remote app in the main window (splash screen "Try again").
#[tauri::command]
fn reload_main_window(app: AppHandle) -> Result<(), String> {
  app
    .get_webview_window("main")
    .ok_or("main window not found")?
    .reload()
    .map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![finish_startup, reload_main_window])
    .register_uri_scheme_protocol("motakarosplash", |_ctx, request: HttpRequest<Vec<u8>>| {
      let path = request.uri().path();
      match path {
        "/" | "/index.html" => splash_response(StatusCode::OK, "text/html; charset=utf-8", SPLASH_HTML.as_bytes()),
        "/logo.webp" => splash_response(StatusCode::OK, "image/webp", SPLASH_LOGO),
        _ => splash_response(StatusCode::NOT_FOUND, "text/plain; charset=utf-8", &b"not found"[..]),
      }
    })
    .on_window_event(|window, event| {
      // The main window starts hidden. If the splash screen is closed before
      // the startup finished (e.g. Alt+F4), reveal the main window so the user
      // is never left with an empty screen.
      if matches!(event, WindowEvent::CloseRequested { .. }) && window.label() == "splashscreen" {
        if let Some(main) = window.app_handle().get_webview_window("main") {
          let _ = main.maximize();
          let _ = main.show();
        }
      }
    })
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while building tauri application");
}
