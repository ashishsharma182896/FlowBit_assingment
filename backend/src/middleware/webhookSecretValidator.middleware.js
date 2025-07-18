

export const webhookSecretValidator = (req, res, next) => {
  try {
    
    const secret = req.headers['x-webhook-secret'];

    
    if (!secret || secret !== process.env.WEBHOOK_SHARED_SECRET) {
      return res.status(401).json({ message: 'Unauthorized - Invalid webhook secret' });
    }

    
    next();
  } catch (error) {
    console.error('Error in webhookSecretValidator middleware:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
