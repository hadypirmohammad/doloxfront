import AuctionItem from '@/components/Auction/AuctionItem';
import DesktopAuctionPanel from '@/components/Auction/DesktopAuctionPanel';
import PhoneAuctionDrawer from '@/components/Auction/PhoneAuctionDrawer';
import SubscriptionCards from '@/components/Auction/SubscriptionCards';
import { getToken, withAuth } from '@/utils/Auth';
import { hasActiveSubscription } from '@/utils/Cal';
import { getAuctions, getUser } from '@/utils/Request';
import React, { useEffect, useState } from 'react'

export async function getServerSideProps(context) {
  // Use the withAuth function to check authentication
  const authResult = await withAuth(context);

  // If the user is not authenticated, they will be redirected
  if (authResult.redirect) {
    return authResult;
  }

  const token = await getToken(context);
  const userdata = await getUser(token).catch(() => null);
  const hasSubscription = hasActiveSubscription(userdata);

  const auctions = await getAuctions(token).catch(() => [])

  return {
    props: {
      auctions: auctions || [],
      token: token || "",
      hasSubscription: !!hasSubscription,
      user: userdata ?? null,
    },
  };
}

const Auctions = ({ auctions, token, user, hasSubscription }) => {
  const [auctionsData, setauctionsdata] = useState(auctions);
  const [priceRange, setPriceRange] = useState({
    min: 10,
    max: 100000,
  })
  const [city, setCity] = useState([]);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");
  const [activeAuctions, setActiveAuctions] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = React.useRef(null);
  //TODO advance filter and added at top of results

  // console.log(user)
  const updateAuctions = async () => {
    setPage(1);
    setHasMore(true);
    const token = await getToken();
    const auctions = await getAuctions(token, query, city, category, priceRange.min, priceRange.max, activeAuctions, 1, 10)
    setauctionsdata(Array.isArray(auctions) ? auctions : [])
  }

  const loadMore = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const token = await getToken();
      const newAuctions = await getAuctions(
        token,
        query,
        city,
        category,
        priceRange.min,
        priceRange.max,
        activeAuctions,
        page + 1,
        10
      );

      if (!Array.isArray(newAuctions) || newAuctions.length === 0) {
        setHasMore(false);
      } else {
        setPage(prev => prev + 1);
        setauctionsdata(prev => [...prev, ...newAuctions]);
      }
    } catch (error) {
      console.error('Error loading more auctions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [hasMore, isLoading, page]);

  useEffect(() => {
    updateAuctions();
  }, [query, city, category, priceRange, activeAuctions]);

  if (!hasSubscription && !auctionsData.length) return (
    <div className='flex justify-center gap-2 bg-[#FAFAFA] px-3 pt-6 pb-10 md:pt-8'>
      <SubscriptionCards token={token} />
    </div>)

  return (
    <div className='flex justify-center gap-2 bg-[#FAFAFA] px-3 pt-6 pb-10 md:pt-8'>
      <div className='w-3/12  h-full max-w-[256px] hidden md:block'>
        <DesktopAuctionPanel
          updateAuction={() => updateAuctions()}
          setPriceRange={setPriceRange}
          city={city}
          setCity={setCity}
          category={category}
          setCategory={setCategory}
          setQuery={setQuery} query={query}
          setActiveAuctions={setActiveAuctions}
          activeAuctions={activeAuctions}
          user={user}
        />
      </div>

      <div className='max-w-screen-lg w-full p-1 min-h-screen'>
        <PhoneAuctionDrawer
          updateAuction={() => updateAuctions()}
          setauctionsdata={setauctionsdata}
          setPriceRange={setPriceRange}
          city={city}
          setCity={setCity}
          category={category}
          setCategory={setCategory}
          setQuery={setQuery}
          query={query}
          setActiveAuctions={setActiveAuctions}
          activeAuctions={activeAuctions}
          user={user}
        />
        {auctionsData?.map((auction, index) => (
          <AuctionItem key={index} auction={auction} />
        ))}
        {hasMore && <div ref={sentinelRef} className="py-8 text-center text-gray-500">در حال لود مزایده های بیشتر...</div>}
        {!hasMore && auctionsData.length > 0 && <div className="py-8 text-center text-gray-500">تمام مزایده ها لود شدن ✅</div>}
      </div>


    </div>
  )
}

export default Auctions
