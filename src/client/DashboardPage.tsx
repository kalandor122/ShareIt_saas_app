import React, { useState, useEffect } from 'react';
import type { User } from "wasp/entities";
import { useAction, connectInternet } from 'wasp/client/operations';
import './DashboardPage.css';

const DashboardPage = ({ user }: { user: User }) => {
    const [sliderValue, setSliderValue] = useState(50);
    const performConnect = useAction(connectInternet);
    
    const [fasParams, setFasParams] = useState<{
        fas: string | null;
        token: string | null;
        gatewayAddress: string | null;
        gatewayPort: string | null;
        redirectUrl: string | null;
        authDir: string | null;
    }>({ fas: null, token: null, gatewayAddress: null, gatewayPort: null, redirectUrl: null, authDir: null });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        
        // Try getting from URL first
        let fas = params.get('fas');
        let token = params.get('tok');
        let gatewayAddress = params.get('gatewayaddress') || params.get('gatewayname');
        let gatewayPort = params.get('gatewayport');
        let redirectUrl = params.get('redir') || params.get('originurl');
        let authDir = params.get('authdir');

        // Fallback to localStorage if URL is empty
        if (!fas && !token) {
            try {
                const stored = localStorage.getItem('opennds_session');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    // Check if it's not too old (e.g., 30 minutes)
                    if (Date.now() - parsed.timestamp < 30 * 60 * 1000) {
                        fas = parsed.fas;
                        token = parsed.token;
                        gatewayAddress = parsed.gatewayAddress;
                        gatewayPort = parsed.gatewayPort;
                        redirectUrl = parsed.redirectUrl;
                        authDir = parsed.authDir;
                        console.log('Loaded OpenNDS session from localStorage');
                    }
                }
            } catch (e) {
                console.error('Failed to parse stored OpenNDS session', e);
            }
        }

        setFasParams({
            fas,
            token,
            gatewayAddress,
            gatewayPort,
            redirectUrl,
            authDir // Note: we need to add this to state too
        });
    }, []);

    const handleButtonClick = async () => {
        if (!fasParams.fas && !fasParams.token) {
             if (!window.confirm("Nem található OpenNDS paraméter (fas vagy tok). Folytatod teszt módban?")) {
                 return;
             }
        }

        try {
            const result = await performConnect({
                amount: sliderValue,
                fas: fasParams.fas || undefined,
                token: fasParams.token || undefined,
                gatewayAddress: fasParams.gatewayAddress || undefined,
                authDir: (fasParams as any).authDir || undefined,
                redirectUrl: fasParams.redirectUrl || undefined
            });
            
            // Success! Clear storage
            localStorage.removeItem('opennds_session');
            window.location.href = result.url;
        } catch (error: any) {
            alert('Hiba: ' + error.message);
        }
    };

    return (
        <div className="dashboard-page">
            <div className="orb of oa" style={{ width: '400px', height: '400px', background: 'var(--coral)', top: '-100px', right: '-100px' }}></div>
            <div className="orb of ob" style={{ width: '300px', height: '300px', background: 'var(--sky)', bottom: '0px', left: '-50px' }}></div>
            <div className="orb os oa" style={{ width: '200px', height: '200px', borderColor: 'var(--lime)', top: '20%', left: '10%' }}></div>

            <div className="dashboard-card">
                <div className="dashboard-eyebrow">ShareNet Irányítópult</div>
                <h1 className="dashboard-title">
                    Netezz <span className="lime">Most!</span>
                </h1>

                <div className="credits-display">
                    Egyenleged: <strong>{user.credits?.toFixed(2) || 0} GB</strong>
                </div>

                <div className="slider-container">
                    <div className="slider-label">
                        <span className="slider-value">{sliderValue}</span>
                        <span className="slider-unit">Mb</span>
                    </div>
                    <input
                        type="range"
                        min="10"
                        max="1000"
                        step="10"
                        value={sliderValue}
                        onChange={(e) => setSliderValue(parseInt(e.target.value))}
                        className="custom-range"
                    />
                    <div className="usage-info">
                        Ennyi adat elegendő kb.<br></br> <strong>{sliderValue * 20}</strong> üzenetre,<br />
                        <strong>{Math.floor(sliderValue / 15)}</strong> perc videónézésre.
                    </div>
                </div>

                <div className="dashboard-actions">
                    <button className="btn-main" onClick={handleButtonClick}>
                        Csatlakozás!
                    </button>
                    <button className="btn-secondary" onClick={() => window.location.href = "/pricing"}>
                        Kredit vásárlása
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
