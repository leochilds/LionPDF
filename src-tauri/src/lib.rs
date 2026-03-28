use std::fs;
use tauri_plugin_dialog::DialogExt;
use tokio::sync::oneshot;

// Command to open a native file dialog and read the selected PDF securely.
// Using tauri_plugin_dialog safely bridges native OS dialogs to the correct thread (like GTK Main Thread on Linux).
// The frontend never sees the path and has no filesystem access.
#[tauri::command]
async fn open_pdf(app: tauri::AppHandle) -> Result<Vec<u8>, String> {
    let (tx, rx) = oneshot::channel();
    
    app.dialog()
        .file()
        .add_filter("PDF Documents", &["pdf"])
        .pick_file(move |file_path| {
            let _ = tx.send(file_path);
        });

    // Wait for the user to pick a file (or cancel)
    if let Ok(Some(file_path)) = rx.await {
        // file_path is a FilePath object, we can convert it to PathBuf
        if let Ok(path) = file_path.into_path() {
            match fs::read(path) {
                Ok(bytes) => Ok(bytes),
                Err(e) => Err(format!("Failed to read file: {}", e)),
            }
        } else {
            Err("Failed to resolve file path".to_string())
        }
    } else {
        Err("No file selected".to_string())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![open_pdf])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
