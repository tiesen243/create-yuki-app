'use client'

import Form from 'next/form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Typography } from '@/components/ui/typography'
import { api } from '@/lib/trpc/client'
import { signOut } from '@/server/auth'

export const Post: React.FC<{ name: string }> = ({ name }) => {
  const [latestPost, { refetch }] = api.post.getLatestPost.useSuspenseQuery()
  const createPost = api.post.createPost.useMutation({ onSuccess: () => refetch() })

  return (
    <section className="mt-4 flex flex-col items-start">
      <Typography>You are signed in as {name}</Typography>
      <Typography>Your latest post: {latestPost?.content ?? 'No posts yet'}</Typography>

      <Form
        className="mt-4 flex items-center gap-4"
        action="/api/trpc/post.createPost"
        onSubmit={async (e) => {
          e.preventDefault()
          const content = e.currentTarget.content.value ?? ''
          if (!content) return
          createPost.mutate({ content })
          e.currentTarget.reset()
        }}
      >
        <Input name="content" disabled={createPost.isPending} />
        <Button size="sm" disabled={createPost.isPending}>
          Post
        </Button>
      </Form>
    </section>
  )
}
