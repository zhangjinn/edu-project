import { getOrganization, getOrganizationId } from "./localStore";

export const getOrgMsg = (type) => {
    const organizationList = getOrganization()
    if (!organizationList) return null
    let id = null, organization = null, name = null, index = 0
    if (getOrganizationId()) {
        id = getOrganizationId()
        organizationList.forEach((item, i) => {
            if (item.id === id) {
                name = item.name
                organization = item
                index = i
            }
        })
    } else {
        organization = organizationList[0]
        id = organization.id
        name = organization.name
    }
    if (type === 'id') {
        return id
    } else if (type === 'name') {
        return name
    }  else if (type === 'index') {
        return index
    } else {
        return organization
    }
}
