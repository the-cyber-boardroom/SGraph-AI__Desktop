mod commands;

use commands::{sites, webviews};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            sites::get_sites,
            webviews::activate_site,
            webviews::toggle_devtools,
        ])
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::Resized(_) = event {
                webviews::resize_all(window);
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running SGraph Desktop");
}
