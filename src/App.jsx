import { useEffect, useState } from 'react';
import './scss/reset.scss';
import './scss/app.scss';
import { useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
import { GrPrevious, GrNext } from 'react-icons/gr';

export default function App() {
  const { data } = useQuery(['data'], async () => {
    return fetch('./api/data.json', {
      headers: {
        Accept: 'application / json',
      },
      method: 'GET',
    })
      .then(res => res.json())
      .then(data => data.items);
  });

  const itemsPerPage = 8;

  //? 빈 아이템 목록부터 시작
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);

  //? 작업 중인 API 또는 데이터에 따른 페이지 오프셋을 사용할 수 있는 항목 오프셋을 사용
  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    if (!data) return;

    //? Fetch data.
    const endOffset = itemOffset + itemsPerPage;
    // console.log(`Loading items from ${itemOffset} to ${endOffset}`);
    setCurrentItems(data.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(data.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, data]);

  //? 사용자가 다른 페이지를 요청하기 위해 클릭할 때 호출
  const handlePageClick = event => {
    const newOffset = (event.selected * itemsPerPage) % data.length;
    // console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`);
    setItemOffset(newOffset);
  };

  return (
    <main className='app'>
      <article className='article-list'>
        {currentItems &&
          currentItems.map(item => (
            <div key={item.id}>
              <div className='article-list__img'>
                <img src={item.snippet.thumbnails.high.url} alt={item.snippet.title} />
              </div>
              <p className='article-list__name'>{item.snippet.title}</p>
            </div>
          ))}
      </article>
      <ReactPaginate
        previousLabel={<GrPrevious />}
        breakLabel='...'
        nextLabel={<GrNext />}
        onPageChange={handlePageClick}
        pageCount={pageCount}
        containerClassName='react-paginate'
        renderOnZeroPageCount={null}
      />
    </main>
  );
}
