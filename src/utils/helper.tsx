import { Star, StarHalf } from "lucide-react";
import styles from "./snnipets.module.css"
export const renderStars = (rating: number | string) => {
    /**
     * return undefined and NaN
     * or rate is not a number
     */
    if (!rating || Number.isNaN(+rating) || typeof +rating !== 'number') return

    const stars = [];
    const fullStars = Math.floor(+rating);
    /**
     * check if the rating has decimaL part.
     * render half star if it does
     */
    const hasHalfStar = +rating % 1 !== 0;


    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        stars.push(
            <Star
                key={`star-${i}`}
                className={styles.starIcon}
                size={16}
                fill="currentColor"
            />
        );
    }

    // Add half star if needed
    if (hasHalfStar) {
        stars.push(
            <StarHalf
                key="half-star"
                className={styles.starIcon}
                size={16}
                fill="currentColor"
            />
        );
    }

    return (
        <span className={styles.starRating} aria-label={`${rating} stars`}>
            {stars}
        </span>
    );
};

/**
* append https: to photo url
* @param url 
* @returns 
*/
export const getImageUrl = (url: string) => {
    if (url.startsWith('//')) {
        return `https:${url}`;
    }
    return url;
};