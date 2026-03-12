import { promises as dns } from 'dns';

async function testDNS() {
  try {
    const addresses = await dns.resolveSrv('_mongodb._tcp.marvelo.air6zj6.mongodb.net');
    console.log('DNS Resolution Successful:', addresses);
  } catch (err) {
    console.error('DNS Resolution Failed:', err.message);
  }
}

testDNS();