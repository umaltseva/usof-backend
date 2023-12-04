import { TheCatAPI } from "@thatapicompany/thecatapi";
import { faker } from '@faker-js/faker';
import { randomUUID } from "crypto";
import { Writable } from "stream"
import bcrypt from 'bcrypt'
import path from 'path'
import fs from 'fs'

const addRecords = async (pool, table, data) => {
    if (data.length == 0) {
        return [];
    }

    const keys = Object.keys(data[0]);
    const columns = keys.join(", ");
    const placeholders = Array.from({ length: keys.length }, (_, i) => i + 1)
        .map(n => "$" + n)
        .join(", ");
    const query = `insert into ${table} (${columns}) values (${placeholders}) returning id`;
    const ids = [];

    for (let record of data) {
        try {
            const result = await pool.query(query, Object.values(record));
            ids.push(result.rows[0].id);
        } catch (_) { }
    }

    return ids;
}

const downloadCats = async (count) => {
    const catAPI = new TheCatAPI(process.env.CAT_KEY);
    const cats = await catAPI.images.searchImages({ limit: count });
    const filenames = [];

    if (!fs.existsSync("images")) {
        await fs.promises.mkdir("images");
    }

    for (let cat of cats) {
        const response = await fetch(cat.url);
        const filename = "images/" + randomUUID() + path.extname(cat.url);
        await response.body.pipeTo(Writable.toWeb(fs.createWriteStream(filename)));
        filenames.push(filename);
    }

    return filenames;
}

const createUsers = async (count) => {
    const avatars = await downloadCats(count);
    const users = [];

    for (let avatar of avatars) {
        const username = faker.internet.userName();
        const user = {
            login: username,
            password: await bcrypt.hash(username, 10),
            full_name: faker.person.fullName(),
            email: faker.internet.email(),
            profile_picture: avatar,
            rating: faker.number.int(count * 10),
            role: faker.helpers.weightedArrayElement([{ weight: 9, value: "user" }, { weight: 1, value: "admin" }]),
            email_verified: faker.datatype.boolean(0.95)
        }

        users.push(user);
    }

    return users;
}

const createPosts = (count, userIds) => {
    return faker.helpers.multiple(() => {
        return {
            author_id: faker.helpers.arrayElement(userIds),
            title: faker.hacker.phrase(),
            publish_date: faker.date.past(),
            status: faker.helpers.weightedArrayElement([{ weight: 9, value: "active" }, { weight: 1, value: "inactive" }]),
            content: faker.helpers.multiple(faker.hacker.phrase, { count: { min: 3, max: 5 } }).join(" ")
        }
    }, { count: parseInt(count) });
}

const createCategories = (count) => {
    return faker.helpers.multiple(() => {
        return {
            title: faker.hacker.noun(),
            description: faker.company.catchPhrase(),
        }
    }, { count: parseInt(count) });
}

const createPostCategories = (maxCount, postIds, categoryIds) => {
    const create = (postId) => {
        return {
            post_id: postId,
            category_id: faker.helpers.arrayElement(categoryIds)
        }
    };

    return postIds.flatMap(postId => {
        return faker.helpers.multiple(() => create(postId), { count: { min: 1, max: maxCount } });
    });
}

const createComments = (maxCount, postIds, userIds) => {
    const create = (postId) => {
        return {
            post_id: postId,
            author_id: faker.helpers.arrayElement(userIds),
            publish_date: faker.date.past(),
            content: faker.commerce.productDescription(),
        }
    };

    return postIds.flatMap(postId => {
        return faker.helpers.multiple(() => create(postId), { count: { min: 0, max: maxCount } });
    });
}

const createLikes = (maxPostLikes, maxCommentLikes, postIds, commentIds, userIds) => {
    const create = (postId, commentId) => {
        return {
            author_id: faker.helpers.arrayElement(userIds),
            publish_date: faker.date.past(),
            post_id: postId,
            comment_id: commentId,
            type: faker.helpers.weightedArrayElement([{ weight: 3, value: "like" }, { weight: 1, value: "dislike" }])
        }
    };

    const postLikes = postIds.flatMap(postId => {
        return faker.helpers.multiple(() => create(postId, null), { count: { min: 0, max: maxPostLikes } });
    });

    const commentLikes = commentIds.flatMap(commentId => {
        return faker.helpers.multiple(() => create(null, commentId), { count: { min: 0, max: maxCommentLikes } });
    });

    return postLikes.concat(commentLikes);
}

const addFakeData = async (pool) => {
    const users = await createUsers(process.env.FAKE_USERS);
    const userIds = await addRecords(pool, "users", users);

    const posts = createPosts(process.env.FAKE_POSTS, userIds);
    const postIds = await addRecords(pool, "posts", posts);

    const categories = createCategories(process.env.FAKE_CATEGORIES);
    const categoryIds = await addRecords(pool, "categories", categories);

    const postCategories = createPostCategories(process.env.MAX_FAKE_POST_CATEGORIES, postIds, categoryIds);
    await addRecords(pool, "post_categories", postCategories);

    const comments = createComments(process.env.MAX_FAKE_POST_COMMENTS, postIds, userIds);
    const commentIds = await addRecords(pool, "comments", comments);

    const likes = createLikes(process.env.MAX_FAKE_POST_LIKES, process.env.MAX_FAKE_COMMENT_LIKES, postIds, commentIds, userIds);
    await addRecords(pool, "likes", likes);
}

export default addFakeData;
