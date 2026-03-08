use tauri::{LogicalPosition, LogicalSize, WebviewBuilder, WebviewUrl};
use url::Url;

const SIDEBAR_WIDTH: f64 = 60.0;
const STATUS_BAR_HEIGHT: f64 = 28.0;

/// Activate a site by creating or showing its native webview.
/// Hides all other site webviews. Each site gets a dedicated
/// native webview (not an iframe), so X-Frame-Options is bypassed.
#[tauri::command]
pub fn activate_site(window: tauri::Window, site_id: String, url: String) -> Result<(), String> {
    let label = format!("site-{}", site_id);

    // Hide all site webviews, show the target if it exists
    let mut found = false;
    for wv in window.webviews() {
        if wv.label().starts_with("site-") {
            if wv.label() == label {
                let _ = wv.show();
                found = true;
            } else {
                let _ = wv.hide();
            }
        }
    }

    if found {
        return Ok(());
    }

    // Create new native webview for this site
    let parsed_url = Url::parse(&url).map_err(|e| e.to_string())?;
    let size = window.inner_size().map_err(|e| e.to_string())?;
    let scale = window.scale_factor().map_err(|e| e.to_string())?;

    let content_width = (size.width as f64 / scale) - SIDEBAR_WIDTH;
    let content_height = (size.height as f64 / scale) - STATUS_BAR_HEIGHT;

    let builder = WebviewBuilder::new(&label, WebviewUrl::External(parsed_url));

    window
        .add_child(
            builder,
            LogicalPosition::new(SIDEBAR_WIDTH, 0.0),
            LogicalSize::new(content_width, content_height),
        )
        .map_err(|e| e.to_string())?;

    Ok(())
}

/// Toggle DevTools on a site's native webview.
#[tauri::command]
pub fn toggle_devtools(window: tauri::Window, site_id: String) -> Result<(), String> {
    let label = format!("site-{}", site_id);
    for wv in window.webviews() {
        if wv.label() == label {
            if wv.is_devtools_open() {
                wv.close_devtools();
            } else {
                wv.open_devtools();
            }
            break;
        }
    }
    Ok(())
}

/// Resize all site webviews to match current window dimensions.
pub fn resize_all(window: &tauri::Window) {
    let Ok(size) = window.inner_size() else { return };
    let Ok(scale) = window.scale_factor() else { return };

    let content_width = (size.width as f64 / scale) - SIDEBAR_WIDTH;
    let content_height = (size.height as f64 / scale) - STATUS_BAR_HEIGHT;

    for wv in window.webviews() {
        if wv.label().starts_with("site-") {
            let _ = wv.set_position(LogicalPosition::new(SIDEBAR_WIDTH, 0.0));
            let _ = wv.set_size(LogicalSize::new(content_width, content_height));
        }
    }
}
