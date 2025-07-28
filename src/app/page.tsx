import { getAllBlogs } from '@/Server/Blogs';
import { getActiveCarouselImages } from '@/Server/Carousel';
import { Blog } from '@/Types/Blogs';
import { CarouselImage } from '@/Types/Carousel';
import HomeClientNew from './HomeClientNew';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] }>;
}

const Home = async ({ searchParams }: Props) => {
  const searchParamsList = await searchParams
  const blogs: { list: Blog[], count: number } = await getAllBlogs({ searchParams: searchParamsList }) as { list: Blog[], count: number }
  
  // Fetch active carousel images
  const carouselImages: CarouselImage[] = await getActiveCarouselImages()

  return <HomeClientNew blogs={blogs} carouselImages={carouselImages} />
}

export default Home
