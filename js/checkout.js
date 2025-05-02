// Definieren von Konstanten
const LAMPORTS_PER_SOL = 1000000000;
let walletConnection = null;

// Exportieren der startCheckout-Funktion für die Verwendung in der components/plans.html
export function startCheckout(planIndex) {
    const plans = [
        { name: "Starter", price: 0 },
        { name: "Trader", price: 1 },
        { name: "Ultra", price: 3 },
        { name: "Institutional", price: 30 }
    ];
    
    const selectedPlan = plans[planIndex];
    
    if (selectedPlan.price === 0) {
        // Für den kostenlosen Plan nur eine Erfolgsmeldung anzeigen
        alert(`You've selected the ${selectedPlan.name} plan. Since it's free, no payment is required.`);
        return;
    }
    
    // Für kostenpflichtige Pläne prüfen, ob das Wallet verbunden ist
    if (!walletConnection) {
        showWalletModal(planIndex);
    } else {
        processPayment(selectedPlan);
    }
}

function showWalletModal(planIndex) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-spaceBlack border border-white/10 rounded-lg p-6 max-w-md w-full">
            <h3 class="text-xl font-bold text-white mb-4">Connect Wallet</h3>
            <p class="text-gray-300 mb-6">Please connect your Solana wallet to continue with the purchase.</p>
            <div class="flex space-x-4">
                <button id="phantom-btn" class="flex-1 py-3 bg-neonGreen hover:bg-neonGreen/80 text-spaceBlack rounded-lg font-medium">
                    Phantom
                </button>
                <button id="solflare-btn" class="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium">
                    Solflare
                </button>
            </div>
            <button id="close-modal" class="w-full mt-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 rounded-lg">
                Cancel
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('phantom-btn').addEventListener('click', () => {
        connectWallet('phantom', planIndex);
        modal.remove();
    });
    
    document.getElementById('solflare-btn').addEventListener('click', () => {
        connectWallet('solflare', planIndex);
        modal.remove();
    });
    
    document.getElementById('close-modal').addEventListener('click', () => {
        modal.remove();
    });
}

async function connectWallet(provider, planIndex) {
    try {
        // Wallet-Verbindung simulieren
        walletConnection = {
            provider: provider,
            address: '8xf3aP...Ru7K9',
            balance: 5.2 * LAMPORTS_PER_SOL
        };
        
        alert(`${provider} wallet connected successfully!`);
        
        // Nach der Verbindung den Checkout-Prozess fortsetzen
        const plans = [
            { name: "Starter", price: 0 },
            { name: "Trader", price: 1 },
            { name: "Ultra", price: 3 },
            { name: "Institutional", price: 30 }
        ];
        
        processPayment(plans[planIndex]);
    } catch (error) {
        console.error("Error connecting wallet:", error);
        alert("Failed to connect wallet. Please try again.");
    }
}

function processPayment(plan) {
    // Platzhalter für die tatsächliche Zahlungsabwicklung
    // In einer echten App würde dies mit der Solana-Blockchain interagieren
    
    const amountInLamports = plan.price * LAMPORTS_PER_SOL;
    
    if (walletConnection.balance < amountInLamports) {
        alert("Insufficient funds in your wallet to complete this purchase.");
        return;
    }
    
    // Erfolgreiche Zahlung simulieren
    alert(`Payment of ${plan.price} SOL for ${plan.name} plan was successful! You will receive an email with further instructions.`);
} 