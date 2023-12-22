"use client"
import Image from 'next/image'
import { Input } from '../ui/input'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
const SearchBar = ({ searchType }: { searchType: string}) => {
    const [searchContent, setSearchContent] = useState("")
    const router = useRouter()
    useEffect(() => {
        // set Timeout means after xms the function will be executed 
        const delaySearch = setTimeout(() => {
            searchContent === "" ?
            router.push("/search")
            :
            router.push(`/search?query=${searchContent}`)
        }, 100)

        return () => clearTimeout(delaySearch)
    }, [searchContent])

    return(
        <div className='searchbar'>
            <Image
                src='/search-gray.svg'
                alt='search'
                width={24}
                height={24}
                className='object-contain'
            />
            <Input
                id='text'
                value={searchContent}
                placeholder={searchType === "user" ? "Search user" : "Search community"}
                onChange={(e) => setSearchContent(e.target.value)}
                className='no-focus searchbar_input'
            />
        </div>
    )
}

export default SearchBar