const { createClient } = require('@supabase/supabase-js');

// Node.js Version für Netlify Functions festlegen
exports.config = { nodeVersion: '18.x' };

// Supabase mit Service-Role-Key initialisieren
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://jpvbnbphgvtokbrlctke.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…KuU'
);

// Funktion wird durch Datenbank-Trigger aufgerufen
exports.handler = async (event) => {
  try {
    // Eingehendes Event parsen
    const payload = JSON.parse(event.body);
    const { record } = payload;
    
    if (!record || !record.email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Keine gültige E-Mail gefunden' })
      };
    }
    
    // Hier würde normalerweise der E-Mail-Versand erfolgen
    // z.B. mit SendGrid, Postmark, AWS SES, etc.
    
    console.log(`Welcome-E-Mail würde gesendet werden an: ${record.email}`);
    
    // Eintrag in Supabase aktualisieren
    await supabase
      .from('waitlist')
      .update({ welcome_email_sent: true })
      .match({ id: record.id });
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Welcome-E-Mail erfolgreich verarbeitet' })
    };
  } catch (error) {
    console.error('Fehler beim Verarbeiten der Welcome-E-Mail:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Interner Serverfehler', error: error.message })
    };
  }
}; 