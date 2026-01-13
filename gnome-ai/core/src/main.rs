use std::error::Error;
use zbus::{connection, interface};
use tracing::{info, warn};
use zbus::zvariant::{OwnedValue, OwnedObjectPath};

struct AiCore {
    version: String,
}

#[interface(name = "org.gnome.AI.Core")]
impl AiCore {
    async fn get_version(&self) -> (String, String) {
        (self.version.clone(), "1.0".to_string())
    }

    async fn create_session(&self, _options: std::collections::HashMap<String, OwnedValue>) -> zbus::fdo::Result<OwnedObjectPath> {
        info!("Creating new session");
        // In a real impl, we would register a new Session object dynamically
        // providing a unique path like /org/gnome/AI/Session/123
        Ok(zbus::zvariant::ObjectPath::try_from("/org/gnome/AI/Session/1").unwrap().into())
    }

    async fn get_capabilities(&self) -> std::collections::HashMap<String, OwnedValue> {
        let mut caps = std::collections::HashMap::new();
        caps.insert("local_model".to_string(), OwnedValue::from(true));
        caps.insert("policy_enforced".to_string(), OwnedValue::from(true));
        caps
    }
}

struct AiSession;

#[interface(name = "org.gnome.AI.Session")]
impl AiSession {
    async fn send_message(
        &self,
        text: String,
        _options: std::collections::HashMap<String, OwnedValue>,
    ) -> (String, std::collections::HashMap<String, OwnedValue>) {
        info!("Received message: {}", text);
        // Mock response
        ("I received your message. Im a skeleton MVP.".to_string(), std::collections::HashMap::new())
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    tracing_subscriber::fmt::init();
    info!("Starting GNOME AI Core...");

    let core = AiCore {
        version: "0.1.0".to_string(),
    };
    
    let _conn = connection::Builder::session()?
        .name("org.gnome.AI")?
        .serve_at("/org/gnome/AI", core)?
        .serve_at("/org/gnome/AI/Session/1", AiSession)? // Static session for MVP
        .build()
        .await?;

    info!("Service org.gnome.AI is running");
    std::future::pending::<()>().await;

    Ok(())
}
