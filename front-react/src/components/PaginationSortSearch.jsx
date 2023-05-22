import React, {useState} from 'react';
import axios from 'axios';

function PaginationSortSearch(props){

    const [prev , setPrev] = useState(false);
    const [next , setNext] = useState(true);


    const onChangePage = e => {
        const number = +e.currentTarget.value; //use Unary Operator 
        if(number >= 1 && Number.isInteger(number)){props.updatePage(number);} 
    }

    const pageGo = () => {

        axios({
            method: 'get',
            url:`/all/?page=${props.page}&sortVids=${props.sortt}` , 
        })
        .then(function(res){
          //console.log(res)
          const all = [...res.data.subVids] 
          props.updateArr(all);
          if(props.page == 1){setPrev(false); setNext(true);}
          if(props.page > 1){setPrev(true);}
          if(all.length != 0){setNext(true);}
          if(all.length == 0){setPrev(true); setNext(false);}
        })
        .catch(function(err){
          console.log(err)
        })
    }


    const pagePrevious = () => {

        setNext(true);

        //if(page == 1){setPrev(false)}

        if(props.page > 1) {
            axios({
                method: 'get',
                url:`/all/?page=${props.page-1}&sortVids=${props.sortt}` , 
            })
            .then(function(res){
              //console.log(res)
              const all = [...res.data.subVids];
              props.updateArr(all);
              props.updatePage(props.page - 1);
              if(props.page == 2){setPrev(false); setNext(true);}
              if(all.length == 0){setPrev(true); setNext(false);}
            })
            .catch(function(err){
              console.log(err)
            });
        }
    }

    const pageNext = () => {

        //console.log(props.page , typeof(props.page))
        //console.log(props.page+1)
        setPrev(true);

        axios({
            method: 'get',
            url:`/all/?page=${props.page + 1}&sortVids=${props.sortt}` , 
        })
        .then(function(res){
            //console.log(res)
            const all = [...res.data.subVids];
            if(all.length != 0){
                props.updatePage(props.page + 1);
                props.updateArr(all);
            }
            else{
                console.log('No more videos');
                setNext(false);
            }
        })
        .catch(function(err){
            console.log(err)
        });
    }

    return (
        <div className='pagination'>
            {prev && <span className='previous' onClick={pagePrevious}></span>}
            {next && <span className='next' onClick={pageNext}></span>}
            <input onChange={onChangePage} value={props.page} min='1' />
            <span onClick={pageGo} className='go'> Go </span>
        </div>
    )

}

export default PaginationSortSearch;