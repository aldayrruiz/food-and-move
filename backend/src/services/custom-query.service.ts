import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class CustomQueryService {
  async filter(customQuery: any, model: Model<any>) {
    const { filter, search, paging, sorting, populate } = customQuery;
    const documents = model.find(filter || {});

    let options = {};
    if (search) {
      options = {
        $or: search.fields.map((field) => {
          const res = {};
          res[field] = new RegExp(search.search, 'i');
          return res;
        }),
      };
    }
    const data = documents.find(options).populate(populate);

    if (sorting) {
      const sort = {};
      sorting.forEach((s) => (sort[s.field] = s.direction));
      data.sort(sort);
    }

    let items;
    if (paging)
      items = await data
        .skip((paging.page - 1) * paging.limit)
        .limit(paging.limit)
        .exec();
    else items = await data.exec();

    const total = await model.count(filter).count(options).exec();

    return {
      items,
      total,
      page: paging ? paging.page : 1,
      limit: paging ? paging.limit : total,
    };
  }
}
