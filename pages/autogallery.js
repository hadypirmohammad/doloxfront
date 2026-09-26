import React, { useCallback, useEffect, useRef, useState } from 'react'
import AutoItem from '../components/global/AutoItem'
import { searchAutoGalleries } from '@/utils/services/autoGalleries'

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

  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')

  const loaderRef = useRef(null)
  const requestIdRef = useRef(0)
  const isFirstFilterRun = useRef(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim())
    }, 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  const applyFilters = useCallback(async () => {
    if (isFirstFilterRun.current) {
      isFirstFilterRun.current = false
      return
    }

    const requestId = ++requestIdRef.current
    setFiltering(true)

    try {
      const data = await searchAutoGalleries({
        search,
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
  }, [search])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const loadMore = useCallback(async () => {
    if (loading || filtering || !hasMore) return

    try {
      setLoading(true)

      const data = await searchAutoGalleries({
        search,
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
  }, [loading, filtering, hasMore, search, page])

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

  const clearSearch = () => {
    setSearchInput('')
    setSearch('')
  }

  return (
    <div className='w-full mx-auto justify-center max-w-screen-xl gap-4 md:flex' dir='rtl'>
      <div className='relative min-h-[500px] rounded-[15px] bg-white pt-6 md:w-full md:pt-8'>
        <h1 className='text-center text-2xl mt-4'>اتو گالری ها</h1>

        <div className='px-4 pt-6 max-w-3xl mx-auto'>
          <div className='relative overflow-hidden rounded-[28px] p-[2px] bg-gradient-to-l from-primary via-[#ff7a3d] to-secondary shadow-[0_12px_30px_rgba(250,69,5,0.18)]'>
            <div className='rounded-[26px] bg-gradient-to-br from-[#fff7f3] via-white to-[#fff0f0] p-4 md:p-5'>
              <div className='flex items-center gap-2 mb-4'>
                <span className='inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/30'>
                  <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
                    <circle cx='11' cy='11' r='7' />
                    <path d='m21 21-4.3-4.3' />
                  </svg>
                </span>
                <div>
                  <p className='font-bold text-accent text-sm md:text-base'>جستجو گالری‌ها</p>
                  <p className='font-["vazir"] text-xs text-base-content/60'>نام یا آدرس گالری را وارد کنید</p>
                </div>
              </div>

              <div className='flex flex-col md:flex-row gap-3 items-stretch md:items-end'>
                <label className='form-control w-full font-["vazir"]'>
                  <div className='label py-1'>
                    <span className='label-text text-sm font-bold text-secondary'>جستجو</span>
                  </div>
                  <input
                    type='text'
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder='نام گالری، آدرس...'
                    className='input border-2 border-primary/20 bg-white focus:outline-none focus:border-primary w-full rounded-xl'
                  />
                </label>

                {search && (
                  <button
                    type='button'
                    onClick={clearSearch}
                    className='btn bg-secondary hover:bg-primary border-none text-white font-["vazir"] rounded-xl shadow-md shadow-secondary/25'
                  >
                    پاک کردن
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className='flex justify-center mt-4'>
            <span className='font-["vazir"] text-sm px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20'>
              {filtering ? 'در حال جستجو...' : `${totalCount} گالری پیدا شد`}
            </span>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 p-4'>
          {!filtering &&
            autos.map((auto) => <AutoItem key={auto.GalleryId} auto={auto} />)}
        </div>

        {!filtering && autos.length === 0 && (
          <p className='text-center font-["vazir"] py-16 text-base-content/60'>
            گالری‌ای پیدا نشد
          </p>
        )}

        <div ref={loaderRef} className='flex justify-center items-center py-6'>
          {loading && <p className='font-["vazir"]'>در حال بارگذاری...</p>}

          {!hasMore && autos.length > 0 && !filtering && (
            <p className='font-["vazir"]'>همه موارد بارگذاری شدند.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Autogallery
