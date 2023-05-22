import React, {useState , useEffect} from 'react';
import axios from 'axios';
import Video from './Video';
import PaginationSortSearch from './PaginationSortSearch'

function AllVideos() {
    const [vidArr , setVidArr] = useState([]);
    const [sortt , setSortt] = useState('');
    const [searchWord , setSearchWord] = useState('');
    const [sortClassName , setSortClassName] = useState('sort');
    const [searchClassName , setSearchClassName] = useState('searchButton');
    const [page , setPage] = useState(1);
    


    useEffect(() => {
        axios({
            method: 'get',
            url:'/all/?page=1' , 
        })
        .then(function(res){
          //console.log(res)
          const all = [...res.data.subVids] //.reverse()
          setVidArr(all)
        })
        .catch(function(err){
          console.log(err)
        })
    } , []);

    const updateArr = (newArr) => {
        setVidArr(newArr);
    }

    const updatePage = (num) => {
        setPage(num);
    }

    const sortButton = () => {
        setPage(1);
        setSortt('mostPopular');
        setSortClassName('sortVisited');
        axios({
            method: 'get',
            url:`/all/?page=1&sortVids=mostPopular` , 
        })
        .then(function(res){
          console.log('sort' ,res)
          const all = [...res.data.subVids] 
          setVidArr(all)
        })
        .catch(function(err){
          console.log(err)
        })
    }

    const onChangeSearch = e => {
        setSearchWord(e.currentTarget.value);
    }

    const searchButton = () => {
        setPage(1);
        setSearchClassName('searchButtonVisited');
        axios({
            method: 'get',
            url:`/all/?page=1&word=${searchWord}` , 
        })
        .then(function(res){
          console.log(res)
          const all = [...res.data.subVids] 
          setVidArr(all)
        })
        .catch(function(err){
          console.log(err)
        })
    }


    return (
        <div className='main'>
            <div className='sortSearch'>
                <div onClick={sortButton} className={sortClassName}> Popular </div>
                <div className='search'>
                    <input onChange={onChangeSearch} className='searchInput' />
                    <span onClick={searchButton} className={searchClassName}> <i className="fa fa-search"></i> </span>
                </div>
            </div>

            <div className='allVid'>
                {vidArr.map( vid => <Video 
                                        key={vid._id} 
                                        vidObj={vid} 
                                        />)}
            </div>

            <PaginationSortSearch updateArr={updateArr} sortt={sortt} 
                                  page={page} updatePage={updatePage} />
        </div>
    )
}

export default AllVideos;