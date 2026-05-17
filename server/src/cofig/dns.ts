import dns from 'dns';

const dnsLookup = dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
]);

export default dnsLookup;