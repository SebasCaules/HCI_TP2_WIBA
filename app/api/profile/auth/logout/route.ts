// app/api/profile/auth/logout/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
    const supabase = createRouteHandlerClient({ cookies })

    const { error } = await supabase.auth.signOut()

    if (error) {
        console.error('Error during logout:', error.message)
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}