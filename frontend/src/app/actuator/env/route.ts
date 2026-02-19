
import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        "activeProfiles": ["production"],
        "propertySources": [
            {
                "name": "systemProperties",
                "properties": {
                    "java.runtime.name": { "value": "Java(TM) SE Runtime Environment" },
                    "sun.boot.library.path": { "value": "/usr/lib/jvm/java-8-oracle/jre/lib/amd64" },
                    "java.vm.version": { "value": "25.201-b09" }
                }
            },
            {
                "name": "applicationConfig: [classpath:/application.yml]",
                "properties": {
                    "aws.accessKeyId": { "value": "AKIAIW54366543456" },
                    "aws.secretKey": { "value": "***************************" },
                    "spring.datasource.password": { "value": "supersecretpassword" }
                }
            }
        ]
    }, {
        headers: {
            'Content-Type': 'application/vnd.spring-boot.actuator.v3+json' // Fake header
        }
    });
}
