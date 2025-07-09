import { useWindowDimensions } from './useClientOnly'

interface Dimensions {
    width: number;
    height: number;
}

function useDimensions(): Dimensions {
    const { width, height } = useWindowDimensions()
    
    return { width, height }
}

export default useDimensions;