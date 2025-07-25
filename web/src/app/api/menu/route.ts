import { NextResponse } from 'next/server';
import { fetchMenuItems } from '@/lib/menu-utils';

export async function GET() {
  try {
    const menuItems = await fetchMenuItems('nextjs');
    return NextResponse.json(menuItems);
  } catch (error) {
    console.error('Menu API: Fatal error:', error);
    return NextResponse.json([]);
  }
}
