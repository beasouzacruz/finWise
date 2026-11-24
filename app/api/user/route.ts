import { NextResponse } from 'next/server';
import { publicUser, withUser } from '@/lib/api';

export const GET = withUser(user => NextResponse.json(publicUser(user)));
