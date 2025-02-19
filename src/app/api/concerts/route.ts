import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const data = await request.json();
  const concert = await prisma.concert.create({
    data: {
      date: new Date(data.date),
      time: data.time,
      venue: data.venue,
      ticketUrl: data.ticketType === 'url' ? data.ticketUrl : null,
      ticketType: data.ticketType,
      description: data.description,
    },
  });

  return NextResponse.json(concert);
}

export async function GET() {
  const concerts = await prisma.concert.findMany({
    orderBy: {
      date: 'asc',
    },
  });
  return NextResponse.json(concerts);
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const data = await request.json();

    // Validate required fields
    if (
      !data.id ||
      !data.date ||
      !data.time ||
      !data.venue ||
      !data.ticketType
    ) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const concert = await prisma.concert.update({
      where: { id: data.id },
      data: {
        date: new Date(data.date),
        time: data.time,
        venue: data.venue,
        ticketUrl: data.ticketType === 'url' ? data.ticketUrl : null,
        ticketType: data.ticketType,
        description: data.description || null,
      },
    });

    return NextResponse.json(concert);
  } catch (error) {
    console.error('Update error:', error);
    return new NextResponse('Error updating concert', { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new NextResponse('Missing ID', { status: 400 });
  }

  await prisma.concert.delete({
    where: { id },
  });

  return new NextResponse(null, { status: 204 });
}
