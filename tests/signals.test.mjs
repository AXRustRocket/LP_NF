/**
 * Signals API Test
 * Tests the Rust Rocket Signals endpoint
 */

import { expect } from 'chai';
import fetch from 'node-fetch';

describe('Signals API', () => {
  it('should return valid WIF token data', async () => {
    const response = await fetch('http://localhost:8888/signals/WIF.json');
    expect(response.status).to.equal(200);
    
    const data = await response.json();
    
    // Check required properties exist
    expect(data).to.have.property('token');
    expect(data).to.have.property('market_data');
    expect(data).to.have.property('trading_metrics');
    expect(data).to.have.property('sentiment');
    expect(data).to.have.property('rust_rocket_metrics');
    
    // Check specific expected values
    expect(data.token.symbol).to.equal('WIF');
    expect(data.market_data).to.have.property('price_usd');
    expect(data.market_data).to.have.property('sparklineData').that.is.an('array');
    expect(data.rust_rocket_metrics).to.have.property('latency_ms').that.is.a('number');
  });
}); 