import { getAllBlogs } from '@/Server/Blogs';
import { Blog } from '@/Types/Blogs';
import HomeClientNew from './HomeClientNew';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] }>;
}

const Home = async ({ searchParams }: Props) => {
  const searchParamsList = await searchParams
  const blogs: { list: Blog[], count: number } = await getAllBlogs({ searchParams: searchParamsList }) as { list: Blog[], count: number }

  return <HomeClientNew blogs={blogs} />
}

export default Home
