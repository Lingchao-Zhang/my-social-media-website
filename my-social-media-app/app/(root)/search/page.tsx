import UserCard from "@/components/cards/UserCard"
import SearchBar from "@/components/shared/SearchBar"
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { redirect } from "next/navigation"
import Image from "next/image"
import { fetchCommunities } from "@/lib/actions/community.actions"
import CommunityCard from "@/components/cards/CommunityCard"
import Pagination from "@/components/shared/Pagination"

const SearchPage = async ({ searchParams: { query, page } }: { searchParams: { query: string | null, page: string | null } }) => {
    const user = await currentUser()
    if(!user){
        return null
    } else {
        const userInfo = await fetchUser(user.id)
        if(!userInfo?.onboarded){
            redirect("/onboarding")
        } else{
            const currentPageNumber = page ? parseInt(page) : 1
            const fetchUserParam = {
                currentUserId: user.id, 
                searchParam: query ? query : "",
                currentPageNumber: currentPageNumber, 
                pageSize: 2
            }

            const fetchCommunitiesParams = {
                searchParam: query ? query : "",
                currentPageNumber: 1, 
                pageSize: 20
            }

            const usersResult = await fetchUsers(fetchUserParam)
            const communitiesResult = await fetchCommunities(fetchCommunitiesParams)
            const users = usersResult.displayedUsers
            const usersIsNext = usersResult.isNext
            const communites = communitiesResult.displayedCommunities

            return(
                <section>
                    <div className="mt-9">
                        <Tabs defaultValue="user" className="w-full">
                            <TabsList className="tab">
                                <TabsTrigger key="user" value="user" className="tab">
                                    <Image 
                                        src={"/user.svg"}
                                        alt={"user icon"}
                                        width={24}
                                        height={24}
                                        className="object-contain"
                                    />
                                    <p className="max-sm:hidden">User</p>
                                </TabsTrigger>
                                <TabsTrigger key="community" value="community" className="tab">
                                    <Image 
                                        src={"/community.svg"}
                                        alt={"community icon"}
                                        width={24}
                                        height={24}
                                        className="object-contain"
                                    />
                                    <p className="max-sm:hidden">Community</p>
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent
                                className="w-full text-light-1 mt-7" 
                                key={"content-user"} 
                                value="user"
                            >
                                <>
                                    <SearchBar searchType="user"/>
                                    <div className="mt-14 flex flex-col gap-9">
                                        {
                                            users.length === 0 ? 
                                            <p className="no-result">No Users</p>
                                            :
                                            users.map((person) => (
                                                <UserCard 
                                                    key={person.id}
                                                    userId={person.id} 
                                                    username={person.username} 
                                                    name={person.name} 
                                                    image={person.image}                 
                                                />
                                            ))
                                        }
                                    </div>

                                    <Pagination 
                                        pageNumber={currentPageNumber} 
                                        isNext={usersIsNext} 
                                        path={"search"}                                    
                                    />
                                </>
                            </TabsContent>
                            <TabsContent
                                className="w-full text-light-1 mt-7" 
                                key={"content-community"} 
                                value="community"
                            >
                                <SearchBar searchType="community"/>
                                <div className="mt-14 flex flex-col gap-9">
                                    {
                                        communites.length === 0 ? 
                                        <p className="no-result">No Communites</p>
                                        :
                                        communites.map((community) => (
                                            <CommunityCard 
                                                key={community.id} 
                                                id={community.id} 
                                                name={community.name} 
                                                communityname={community.communityname} 
                                                image={community.image} 
                                                biography={community.biography} 
                                                members={community.members}                                                            
                                            />
                                        ))
                                    }
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>                
                </section>
            )
        }
    }
}

export default SearchPage