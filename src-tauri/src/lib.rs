use rfd::FileDialog;
use std::fs;

// Command to open a native file dialog and read the selected PDF securely.
// This prevents the frontend from needing any direct file system permissions.
#[tauri::command]
async fn open_pdf() -> Result<Vec<u8>, String> {
    if let Some(path) = FileDialog::new()
        .add_filter("PDF Documents", &["pdf"])
        .pick_file() 
    {
        match fs::read(path) {
            Ok(bytes) => Ok(bytes),
            Err(e) => Err(format!("Failed to read file: {}", e)),
        }
    } else {
        Err("No file selected".to_string())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![open_pdf])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
