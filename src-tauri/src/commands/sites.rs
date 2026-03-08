use serde::Serialize;

#[derive(Serialize, Clone)]
pub struct SiteConfig {
    pub id: String,
    pub name: String,
    pub url: String,
    pub icon: String,
}

#[tauri::command]
pub fn get_sites() -> Vec<SiteConfig> {
    vec![
        SiteConfig {
            id: "send".to_string(),
            name: "Send".to_string(),
            url: "https://send.sgraph.ai".to_string(),
            icon: "send".to_string(),
        },
        SiteConfig {
            id: "vault".to_string(),
            name: "Vault".to_string(),
            url: "https://vault.sgraph.ai".to_string(),
            icon: "vault".to_string(),
        },
        SiteConfig {
            id: "workspace".to_string(),
            name: "Workspace".to_string(),
            url: "https://workspace.sgraph.ai".to_string(),
            icon: "workspace".to_string(),
        },
        SiteConfig {
            id: "tools".to_string(),
            name: "Tools".to_string(),
            url: "https://dev.tools.sgraph.ai".to_string(),
            icon: "tools".to_string(),
        },
    ]
}
