 import Clutter from 'gi://Clutter';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import St from 'gi://St';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

// D-Bus Interface Proxy (Simplified)
const AIInterface = `
<node>
<interface name="org.gnome.AI.Session">
<method name="SendMessage">
    <arg type="s" direction="in"/>
    <arg type="a{sv}" direction="in"/>
    <arg type="s" direction="out"/>
    <arg type="a{sv}" direction="out"/>
</method>
</interface>
</node>`;

const AIProxy = Gio.DBusProxy.makeProxyWrapper(AIInterface);

class AIIndicator extends PanelMenu.Button {
    _proxy: any;

    constructor() {
        super(0.0, 'AI Assistant', false);

        // Icon
        const icon = new St.Icon({
            icon_name: 'polari-symbolic', // Placeholder icon
            style_class: 'system-status-icon',
        });
        this.add_child(icon);

        // Menu
        this.menu.addAction('Ask AI...', () => this._showInput());

        this._initProxy();
    }

    private _initProxy() {
        new AIProxy(
            Gio.DBus.session,
            'org.gnome.AI',
            '/org/gnome/AI/Session/1',
            (proxy: any, error: any) => {
                if (error) {
                    logError(error, 'Could not connect to AI service');
                    return;
                }
                this._proxy = proxy;
            }
        );
    }

    private _showInput() {
        // In a real implementation, this would open a dialog or reveal a text entry 
        // in the popup menu. For MVP, we just log.
        Main.notify("AI Assistant", "Connecting to core...");
        
        if (this._proxy) {
            this._proxy.SendMessageRemote("Hello from GNOME Shell", {}, (result: any, error: any) => {
                if (error) {
                    Main.notify("AI Error", error.message);
                } else {
                    const [reply, meta] = result;
                    Main.notify("AI Reply", reply);
                }
            });
        }
    }
}

export default class AIExtension extends Extension {
    _indicator: AIIndicator | null = null;

    enable() {
        this._indicator = new AIIndicator();
        Main.panel.addToStatusArea(this.uuid, this._indicator);
    }

    disable() {
        if (this._indicator) {
            this._indicator.destroy();
            this._indicator = null;
        }
    }
}
