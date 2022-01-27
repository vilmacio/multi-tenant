# multi-tenant

*In a multitenancy environment, multiple customers share the same application, running on the same operating system, on the same hardware, with the same data-storage mechanism. 
The distinction between the customers is achieved during application design, thus customers do not share or see each other's data.*
######
*[Wikipedia](https://en.wikipedia.org/wiki/Multitenancy)*

---

## Get started
After cloning and installing dependencies, run the code:
### Running with Docker
```console
admin:~$ yarn up --accessTag
```
See [```/package.json```](/package.json) file for more commands.

## Usage
### Access tags
First you'll need to use the ```--signup``` tag to create a new tenant.
```console
admin:~$ yarn up --signup
```
You can now login to view your profile. Use ```--login``` tag.
```console
admin:~$ yarn up --login
```

Use the ```--help``` tag for more tags and explanations.

## License
This project is under the MIT license. See the [LICENSE](https://github.com/vilmacio/multi-tenant/blob/master/LICENSE) for more information.

---

Created by [vilmacio](https://github.com/vilmacio)
