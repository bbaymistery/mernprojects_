import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getDataAPI } from '../../utils/fetchData'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import LoadIcon from '../../images/loading.gif'
import UserCard from '../UserCard'

const Search = () => {
    const [users, setUsers] = useState([])
    const [load, setLoad] = useState(false)
    const [search, setSearch] = useState('')

    const dispatch = useDispatch()
    const { auth } = useSelector(state => state)

    const handleSearch = async (e) => {
        e.preventDefault()
        if (!search.trim()) return;

        try {
            setLoad(true)
            const res = await getDataAPI(`search?username=${search}`, auth.token)
            setUsers(res.data.users)
            setLoad(false)
        } catch (err) {
            dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err?.response?.data?.msg || err.message } })
        }
    }

    const handleClose = () => {
        setSearch('')
        setUsers([])
    }

    const handleSearching = (e) => {
        const val = e.target.value.toLowerCase().replace(/ /g, '')
        setSearch(val)
        if (val.length === 0) setUsers([])
    }

    return (
        <form className="search_form position-relative" onSubmit={handleSearch}>
            <div className="input-group align-items-center">
                <input
                    type="text"
                    name="search"
                    className="form-control form-control-sm rounded-pill px-3 bg-light border-0"
                    placeholder="Search users..."
                    value={search}
                    id="search"
                    onChange={handleSearching}
                    style={{ fontSize: "13px", height: "36px", width: "220px", outline: "none" }}
                />
                {search && (
                    <span
                        className="close_search position-absolute text-secondary cursor-pointer"
                        onClick={handleClose}
                        style={{ right: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", zIndex: 10 }}
                    >
                        &times;
                    </span>
                )}
            </div>

            <button type="submit" style={{ display: 'none' }}>Search</button>
            {load && <img className="loading position-absolute" src={LoadIcon} alt="loading" style={{ right: "10px", top: "50%", transform: "translateY(-50%)", width: "16px" }} />}

            {search && users.length > 0 && (
                <div className="users position-absolute bg-white border rounded shadow-sm w-100 mt-1 overflow-auto" style={{ maxHeight: "300px", zIndex: 999 }}>
                    {users.map(user => (
                        <UserCard key={user._id} user={user} border="border-bottom" handleClose={handleClose} />
                    ))}
                </div>
            )}
        </form>
    )
}

export default Search
