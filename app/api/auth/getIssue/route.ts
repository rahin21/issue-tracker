import { connectToDatabase } from "@/app/helpers/server-helpers";
import prisma from "@/prisma";
import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
export const GET = async () => {
    try {
        await prisma.$connect();
        const getIssue = await prisma.issue.findMany({})
        return NextResponse.json(getIssue,{status:200})
    } catch (error) {
        console.log(error)
    }finally {
        await prisma.$disconnect();
    }
}