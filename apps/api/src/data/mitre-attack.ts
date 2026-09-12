/** A deliberately small, local ATT&CK catalog for CyberTrace demo profiles. */
export type MitreTechnique = { id:string; name:string; tactic:string; description:string };

export const mitreByAttackProfile:Record<string,MitreTechnique[]>={
  "Credential Phishing Cluster":[
    {id:"T1566",name:"Phishing",tactic:"Initial Access",description:"Adversaries may send phishing messages to gain access to victim systems."},
    {id:"T1566.002",name:"Spearphishing Link",tactic:"Initial Access",description:"Adversaries may use a link in a spearphishing message to direct victims to malicious content."},
    {id:"T1056",name:"Input Capture",tactic:"Credential Access",description:"Adversaries may capture credentials through input collection."}
  ],
  "Ransomware Infrastructure Cluster":[
    {id:"T1105",name:"Ingress Tool Transfer",tactic:"Command and Control",description:"Adversaries may transfer tools or files from an external system into a compromised environment."},
    {id:"T1486",name:"Data Encrypted for Impact",tactic:"Impact",description:"Adversaries may encrypt data to interrupt availability to systems and services."}
  ],
  "Malware Command-and-Control Cluster":[
    {id:"T1071",name:"Application Layer Protocol",tactic:"Command and Control",description:"Adversaries may communicate using application layer protocols to avoid detection."},
    {id:"T1105",name:"Ingress Tool Transfer",tactic:"Command and Control",description:"Adversaries may transfer tools or files from an external system into a compromised environment."}
  ]
};
