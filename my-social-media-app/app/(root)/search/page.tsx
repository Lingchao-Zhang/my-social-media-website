import UserCard from "@/components/cards/UserCard"
import SearchBar from "@/components/shared/SearchBar"
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

const SearchPage = async ({ searchParams: { query } }: { searchParams: { query: string | null } }) => {
    const user = await currentUser()
    if(!user){
        return null
    } else {
        const userInfo = await fetchUser(user.id)
        if(!userInfo?.onboarded){
            redirect("/onboarding")
        } else{
            const fetchUserParam = {
                currentUserId: user.id, 
                searchParam: query ? query : "",
                currentPageNumber: 1, 
                pageSize: 20
            }

            const result = await fetchUsers(fetchUserParam)
            const users = result.displayedUsers
            return(
                <section>
                    <SearchBar />
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
                </section>
            )
        }
    }
}

export default SearchPage