export const handleUpdateDataUsage = (socket, userId) => {
    console.log('handle update usage event handler is being called');
    socket.on('update-data-usage');
}