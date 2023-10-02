import { NotFoundException } from "@nestjs/common";

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
        if (options && options.id) {
            if (options.id === 99) {
                throw new NotFoundException('not found;')
            }
        }
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
}

export class EntityManagerMock {
    transaction(callback: (entityManager) => Promise<any>) {
        return callback(this);
    }
    save() {
        return Promise.resolve({});
    }
}