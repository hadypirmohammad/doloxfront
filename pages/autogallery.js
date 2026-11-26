import Image from 'next/image'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import AutoItem from '../components/global/AutoItem'
import GalleryFilterBar from '@/components/AutoGallery/GalleryFilterBar'
import { searchAutoGalleries } from '@/utils/services/autoGalleries'
import { getcities } from '@/utils/Request'
import { toPersianDigits } from '@/utils/Cal'

const PAGE_SIZE = 12

export async function getServerSideProps() {
  try {
    const data = await searchAutoGalleries({
      page: 1,
      pageSize: PAGE_SIZE,
    })

    return {
      props: {
        initialData: data,
      },
    }
  } catch (error) {
    console.error('Auto gallery search failed:', error)
    return {
      props: {
        initialData: {
          Items: [],
          Page: 1,
          PageSize: PAGE_SIZE,
          TotalPages: 1,
          TotalCount: 0,
        },
      },
    }
  }
}

const Autogallery = ({ initialData }) => {
  const [autos, setAutos] = useState(initialData?.Items || [])
  const [page, setPage] = useState(2)
  const [loading, setLoading] = useState(false)
  const [filtering, setFiltering] = useState(false)
  const [hasMore, setHasMore] = useState(
    (initialData?.Page || 1) < (initialData?.TotalPages || 1)
  )
  const [totalCount, setTotalCount] = useState(initialData?.TotalCount || 0)

  const [cities, setCities] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const [filters, setFilters] = useState({ search: '', type: '', city: null, status: '' })

  const loaderRef = useRef(null)
  const requestIdRef = useRef(0)
  const isFirstFilterRun = useRef(true)

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const result = await getcities()
        setCities(result || [])
      } catch (error) {
        setCities([])
      }
    }

    fetchCities()
  }, [])

  const applyFilters = useCallback(async () => {
    if (isFirstFilterRun.current) {
      isFirstFilterRun.current = false
      return
    }

    const requestId = ++requestIdRef.current
    setFiltering(true)

    try {
      const data = await searchAutoGalleries({
        search: filters.search,
        type: filters.type,
        status: filters.status,
        cityId: filters.city?.CityId || null,
        cityName: filters.city?.CityName || null,
        page: 1,
        pageSize: PAGE_SIZE,
      })

      if (requestId !== requestIdRef.current) return

      setAutos(data?.Items || [])
      setTotalCount(data?.TotalCount || 0)
      setPage(2)
      setHasMore((data?.Page || 1) < (data?.TotalPages || 1))
    } catch (err) {
      console.error('Filter error:', err)
    } finally {
      if (requestId === requestIdRef.current) {
        setFiltering(false)
      }
    }
  }, [filters])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const loadMore = useCallback(async () => {
    if (loading || filtering || !hasMore) return

    try {
      setLoading(true)

      const data = await searchAutoGalleries({
        search: filters.search,
        type: filters.type,
        status: filters.status,
        cityId: filters.city?.CityId || null,
        cityName: filters.city?.CityName || null,
        page,
        pageSize: PAGE_SIZE,
      })

      setAutos((prev) => [...prev, ...(data?.Items || [])])
      setTotalCount(data?.TotalCount || 0)

      if ((data?.Page || page) >= (data?.TotalPages || 1)) {
        setHasMore(false)
      } else {
        setPage((prev) => prev + 1)
      }
    } catch (err) {
      console.error('Load more error:', err)
    } finally {
      setLoading(false)
    }
  }, [loading, filtering, hasMore, filters, page])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore()
        }
      },
      {
        threshold: 0.5,
      }
    )

    const currentRef = loaderRef.current

    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [loadMore])

  const runSearch = (next) => {
    setFilters({
      search: searchInput.trim(),
      type: next?.type ?? filters.type,
      city: next?.city !== undefined ? next.city : filters.city,
      status: next?.status ?? filters.status,
    })
  }

  return (
    <div dir='rtl' className='min-h-screen bg-[#F5F6F8] text-secondary'>
      <section className='relative overflow-hidden bg-[#121820]'>
        <Image
          src='/media/images/gallery-hero.webp'
          alt=''
          fill
          priority
          sizes='100vw'
          className='object-cover object-center'
        />
        <span className='pointer-events-none absolute inset-0 bg-[linear-gradient(to_left,rgba(10,14,20,.55)_0%,rgba(10,14,20,.2)_60%,rgba(10,14,20,0)_100%)]' />
        <div className='relative mx-auto hidden max-w-screen-xl px-4 pb-28 pt-14 sm:block sm:px-6'>
          <span className='block h-1 w-12 rounded-full bg-primary' />
          <h1 className='m-0 pt-4 text-[38px] font-bold leading-[1.4] text-white'>
            <span className='text-primary'>گالری‌ها</span>
          </h1>
          <p className='m-0 max-w-md pt-3 text-[15px] leading-[2] text-[#C8D0DA]'>
            دسترسی سریع به گالری‌های معتبر خودرو و موتور سیکلت در سراسر کشور.
          </p>
        </div>
        <div className='h-[130px] sm:hidden' />
      </section>

      <div className='relative z-10 mx-auto -mt-16 max-w-screen-xl px-4 sm:px-6'>
        <GalleryFilterBar
          cities={cities}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          filters={filters}
          onApply={runSearch}
        />

        <div className='flex items-center justify-between gap-3 pt-7'>
          <p className='m-0 text-[15px] font-bold sm:text-[17px]'>
            {filtering ? 'در حال جستجو...' : `${toPersianDigits(totalCount)} گالری پیدا شد`}
          </p>
        </div>

        <div className='grid grid-cols-1 gap-4 pt-4 lg:grid-cols-2'>
          {!filtering && autos.map((auto) => <AutoItem key={auto.GalleryId} auto={auto} />)}
        </div>

        {filtering && (
          <div className='flex justify-center py-16'>
            <span className='loading loading-spinner loading-md text-primary' />
          </div>
        )}

        {!filtering && autos.length === 0 && (
          <div className='flex flex-col items-center gap-3 py-20 text-center'>
            <span className='flex h-[54px] w-[54px] items-center justify-center rounded-full bg-[#FFEDE3] text-primary'>
              <svg width='26' height='26' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round'>
                <circle cx='11' cy='11' r='7' />
                <path d='m21 21-4.3-4.3' />
              </svg>
            </span>
            <p className='m-0 text-sm text-[#8B94A5]'>گالری‌ای با این مشخصات پیدا نشد</p>
          </div>
        )}

        <div ref={loaderRef} className='flex items-center justify-center py-8'>
          {loading && <span className='loading loading-spinner loading-md text-primary' />}
          {!hasMore && autos.length > 0 && !filtering && (
            <p className='m-0 text-[13px] text-[#8B94A5]'>همه گالری‌ها نمایش داده شد</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Autogallery
