import { Holiday } from '@/types/booking'
import React from 'react'
import Image from 'next/image'
import styles from "./booking.module.css"
import { getImageUrl, renderStars } from '@/utils/helper'

interface BookingCardProps {
    holiday: Holiday;
}

export default function BookingCard({ holiday }: BookingCardProps) {
    // Helper function to format price
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: 'GBP',
            maximumFractionDigits: 0
        }).format(price);
    };

    const imageUrl = holiday.hotel.content.images[0]?.RESULTS_CAROUSEL?.url;

    return (
        <article
            data-testid="booking-card"
            className={styles.hotelCard}>
            <div className={styles.imageWrapper}>
                {imageUrl && (
                    <Image
                        src={getImageUrl(imageUrl)}
                        alt={holiday.hotel.name}
                        width={300}
                        height={200}
                        className={styles.hotelImage}
                        data-testid="hotel-image"
                    />
                )}
            </div>

            <div className={styles.mainContent}>
                <div className={styles.headerSection}>
                    <h2 className={styles.hotelName} data-testid="hotel-name">
                        {holiday.hotel.content.name}
                    </h2>
                    <div className={styles.locationInfo}>
                        <div className={styles.ratingWrapper} data-testid="star-rating">
                            {renderStars(holiday.hotel.content.starRating)}
                        </div>
                        <span className={styles.location} data-testid="hotel-location">
                            {holiday.hotel.content.parentLocation}
                        </span>
                    </div>
                </div>

                <div className={styles.detailsSection}>
                    <div className={styles.leftDetails}>
                        <div className={styles.boardBasis} data-testid="board-basis">
                            {holiday.hotel.boardBasis}
                        </div>

                        <div className={styles.facilities} data-testid="facilities">
                            {holiday.hotel.content.hotelFacilities.slice(0, 3).map(facility => (
                                <span
                                    key={facility}
                                    className={styles.facilityTag}
                                    data-testid="facility-tag"
                                >
                                    {facility}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className={styles.rightDetails}>
                        <div className={styles.points} data-testid="points">
                            <div>{holiday.virginPoints.toLocaleString()} Virgin Points</div>
                            <div>+ {holiday.tierPoints.toLocaleString()} Tier Points</div>
                        </div>

                        <div className={styles.priceSection}>
                            <div className={styles.priceInfo}>
                                <div className={styles.priceLabel}>Price per person</div>
                                <div className={styles.price} data-testid="price-per-person">
                                    {formatPrice(holiday.pricePerPerson)}
                                </div>
                                <div className={styles.totalPrice} data-testid="total-price">
                                    Total: {formatPrice(holiday.totalPrice)}
                                </div>
                            </div>
                        </div>

                        <button
                            className={styles.bookButton}
                            data-testid="book-button"
                            aria-label={`Book ${holiday.hotel.name}`}
                        >
                            Book Now
                        </button>
                    </div>
                </div>
            </div>
        </article>
    )
}