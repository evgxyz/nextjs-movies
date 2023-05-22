
import Link from '@/next/Link';
import {setURLParam} from '@/units/url';
import _ from 'lodash';
import css from './Pagination.module.scss';

interface PaginationProps {
  baseUrl: string, 
  paramName: string
  start: number, 
  end: number,
  curr: number,
}

export function Pagination({baseUrl, paramName, start, end, curr}: PaginationProps) {  

  const around = 2;
  const htmlLeft = [];
  const htmlRight = [];
  const html = [];

  start = Math.min(start, curr);
  end = Math.max(end, curr);
   
  const outStart = Math.max(curr - around, start);
  
  if (outStart > start) {
    htmlLeft.push(
      <Link href={setURLParam(baseUrl, paramName, start.toString())}>
        <div className={css['item']}>{start}</div>
      </Link>
    );

    if (outStart > start + 1) {
      htmlLeft.push('...');
    }
  }
  
  const outEnd = Math.min(curr + around, end);
  
  if (outEnd < end) {
    htmlRight.push(
      <Link href={setURLParam(baseUrl, paramName, end.toString())}>
        <div className={css['item']}>{end}</div>
      </Link>
    );

    if (outEnd < end - 1) {
      htmlRight.unshift('...');
    }
  }
  
  for (let p = outStart; p <= outEnd; p++) {
    if (p !== curr) {
      html.push(
        <Link href={setURLParam(baseUrl, paramName, p.toString())}>
          <div className={css['item']}>{p}</div>
        </Link>
      )
    } else {
      html.push(
        <div className={[css['item'], css['curr-item']].join(' ')}>{p}</div>
      )  
    }
  }
  
  return (
    <div className={css['body']}>
      {[...htmlLeft, ...html, ...htmlRight]}
    </div>
  );

  /* return (
    <div className={css['body']}>
      { _.range(start, start + count).map(i => {
            if (i !== curr) {
              const url = setURLParam(baseUrl, paramName, i.toString());
              return (
                <Link key={i} href={url}>
                  <div className={css['item']}>{i}</div>
                </Link>
              )
            } else {
              return (
                <div 
                  key={i} 
                  className={[css['item'], css['curr-item']].join(' ')}
                >{i}</div>
              )
            }
          }
        )
      }
    </div>
  ) */
}