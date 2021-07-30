box.cfg {
    listen = '3301';
}
box.schema.user.grant('guest','read,write,execute,create,drop','universe')

function getUsers(fn, ln)
    val = box.space.mysocionet.index.mysocionet_secondary_idx:select({fn,ln}, {iterator='EQ'})
    return val
end
