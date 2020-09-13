import { firestore, saveOrder, sendOrder } from 'firebase/server';

export default async function (req, res) {
  const { action, oid } = req.body;

  const orderRef = firestore.collection('orders').doc(oid);

  switch (action) {
    case 'save': {
      const orderDoc = await orderRef.get();
      const orderData = JSON.parse(orderDoc.data().data);

      saveOrder(orderData, orderRef);
      sendOrder(orderData);

      break;
    }

    case 'delete':
      orderRef.delete();

      break;
  }

  res.end();
}
