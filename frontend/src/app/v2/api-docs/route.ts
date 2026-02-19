
import { NextResponse } from 'next/server';

export async function GET() {
    const json = {
        "swagger": "2.0",
        "info": {
            "description": "Api Documentation",
            "version": "1.0",
            "title": "Api Documentation",
            "contact": {}
        },
        "host": "localhost:8080",
        "basePath": "/",
        "tags": [
            { "name": "basic-error-controller", "description": "Basic Error Controller" }
        ],
        "paths": {
            "/api/user": {
                "get": {
                    "tags": ["user-controller"],
                    "summary": "getAllUsers",
                    "operationId": "getAllUsersUsingGET",
                    "produces": ["*/*"],
                    "responses": { "200": { "description": "OK" } }
                }
            }
        }
    };
    return NextResponse.json(json);
}
