export class RepositoryMock<T> {
    data: T[] = [];

    findOne(options) {
        return Promise.resolve(this.data.find(item => {
            for (const key in options.where) {
                if (item[key] !== options.where[key]) return false;
            }
            return true;
        }));
    }

    findOneBy(options) {
        return Promise.resolve(this.data.find(item => {
            for (const key in options) {
                if (item[key] !== options[key]) return false;
            }
            return true;
        }));
    }
    create(createDto): T {
        return { id: 1, ...createDto };
    }

    async save(entity: T) {
        this.data.push(entity);
        return Promise.resolve(entity);
    }

    find(options?): Promise<T[]> {
        return Promise.resolve(this.data.filter(item => {
            for (const key in options?.where) {
                if (item[key] !== options.where[key]) return false;
            }
            return true;
        }));
    }

    update(id, options): Promise<T> {
        let item = this.data.find(item => item['id'] == id);

        for (const key in options) {
            item[key] = options[key];
        }
        return Promise.resolve(
            item
        );
    }
}

export class EntityManagerMock {
    transaction(callback) {
        return callback(this);
    }
    save() {
        return Promise.resolve({});
    }

    update(entity, filters, field) {
        return Promise.resolve({});
    }
}