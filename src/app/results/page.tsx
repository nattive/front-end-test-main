import { Suspense } from 'react';
import SearchResultsComponent from '../components/search-results/search-results.component'
import Loading from './loading';
import { Rooms } from '@/utils/composition.service';
import SearchSummary from '../components/search-summary/search-summary.component';

export default function Results({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {


  const body = {
    bookingType: searchParams.bookingType as string,
    direct: false,
    location: searchParams.location as string,
    departureDate: searchParams.departureDate as string,
    duration: searchParams.duration as string,
    gateway: searchParams.gateway as string,
    partyCompositions: Rooms.parseAndConvert([searchParams.partyCompositions as string]),
  };
  return (
    <>

      <SearchSummary {...body} />
      <Suspense fallback={<Loading />}>
        <SearchResultsComponent searchParams={searchParams} />
      </Suspense>
    </>
  )
}
