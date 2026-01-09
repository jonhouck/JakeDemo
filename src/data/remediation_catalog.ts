export const REMEDIATION_CATALOG: Record<string, string> = {
    'CVE-2021-44228': \`### 🚨 Immediate Action: Log4Shell
**Severity**: CRITICAL (CVSS 10.0)
This vulnerability allows remote code execution in \`log4j\`.

**Remediation Steps**:
1.  **Upgrade**: Update all instances of Apache Log4j to version **2.17.1** or newer immediately.
2.  **Mitigation**: If upgrading is not immediately possible, remove the \`JndiLookup\` class from the classpath:
    \`\`\`bash
    zip -q -d log4j-core-*.jar org/apache/logging/log4j/core/lookup/JndiLookup.class
    \`\`\`
3.  **Verify**: Ensure no vulnerable jars remain in transitive dependencies.

[CISA Guidance](https://www.cisa.gov/uscert/apache-log4j-vulnerability-guidance)\`,

    'CVE-2017-0144': \`### 🚨 Immediate Action: EternalBlue (MS17-010)
**Severity**: CRITICAL (CVSS 8.1 - 9.3)
Exploits SMBv1 handling in Microsoft Windows. Used by WannaCry.

**Remediation Steps**:
1.  **Patch**: Apply Microsoft Security Bulletin **MS17-010** immediately.
2.  **Disable SMBv1**: Ensure SMBv1 is disabled on all clients and servers.
    \`\`\`powershell
    Set-SmbServerConfiguration -EnableSMB1Protocol $false
    \`\`\`
3.  **Firewall**: Block port 445 on external facing firewalls.

[Microsoft Security Bulletin MS17-010](https://docs.microsoft.com/en-us/security-updates/securitybulletins/2017/ms17-010)\`,

    'CVE-2023-34362': \`### 🚨 Immediate Action: MOVEit Transfer SQLi
**Severity**: CRITICAL (CVSS 9.8)
Allows unauthenticated attackers to access the database.

**Remediation Steps**:
1.  **Patch**: Apply the latest security patch provided by Progress Software.
2.  **Review Logs**: Check generic IIS logs for unexpected requests to the application.
3.  **Reset Credentials**: Reset service account credentials for affected systems.

[CISA Advisory](https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-158a)\`,

    'CVE-2021-26855': \`### 🚨 ProxyLogon (Exchange Server)
**Severity**: CRITICAL (CVSS 9.8)
Bypasses authentication on Microsoft Exchange Servers.

**Remediation Steps**:
1.  **Patch**: Install the latest Cumulative Update (CU) and Security Update (SU) for your Exchange version.
2.  **Scan**: Run the Microsoft Exchange On-Premises Mitigation Tool (EOMT).
3.  **Isolate**: If unpatched, restrict access to the Exchange Server from the internet immediately.

[Microsoft Exchange Team Blog](https://techcommunity.microsoft.com/t5/exchange-team-blog/released-march-2021-exchange-server-security-updates/ba-p/2175901)\`,

    'CVE-2014-0160': \`### ⚠️ Heartbleed (OpenSSL)
**Severity**: HIGH (CVSS 7.5)
Allows reading of memory systems protected by vulnerability versions of OpenSSL.

**Remediation Steps**:
1.  **Upgrade**: Update OpenSSL to version **1.0.1g** or newer.
2.  **Revoke Keys**: Revoke and reissue any SSL certificates that may have been exposed.
3.  **Reset Passwords**: Force password resets for users of the affected service.

[NIST NVD Entry](https://nvd.nist.gov/vuln/detail/CVE-2014-0160)\`,
};
