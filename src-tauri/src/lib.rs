mod commands;

use commands::sites;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            sites::get_sites,
        ])
        .run(tauri::generate_context!())
        .expect("error while running SGraph Desktop");
}
